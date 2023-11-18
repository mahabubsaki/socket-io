import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

const app = express();
const port = 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});


dotenv.config();
app.use(cors());
app.use(express.json());




const client = new MongoClient(process.env.MONGO_URI, {
    connectTimeoutMS: 60 * 1000,
});
const usersCollection = client.db('Chat-App').collection('users');
const friendReqCollection = client.db("Chat-App").collection("friend-request");
const friendShipCollection = client.db("Chat-App").collection("friend-ship");
const chatCollection = client.db("Chat-App").collection("chats");


app.get('/', async (req, res) => {
    res.send({ message: "s" });
});



app.put('/auth/login', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const result = await usersCollection.findOneAndUpdate(filter, {
        $set: {
            ...user
        },
        $currentDate: {
            lastModified: true,
        },
    }, { upsert: true, returnDocument: 'after' });

    return res.send(result);
});

app.post('/users/send-request', async (req, res) => {
    const request = req.body;
    try {
        const result = await friendReqCollection.insertOne(request);
        if (result.acknowledged) {
            return res.send({ success: true, message: "Successfully send friend Request" });
        } else {
            throw new Error("Failed to send requesat");
        }
    } catch (err) {
        return res.send({ error: true, message: err.message });
    }
});

app.post('/users/accept-request', async (req, res) => {
    const { friends, senderEmail } = req.body;
    const session = client.startSession();
    try {
        await session.withTransaction(async () => {
            await friendShipCollection.insertMany(friends, { session });
            await friendReqCollection.deleteOne({ sender: senderEmail }, { session });
            return res.send({ message: "Successfully accepted friend request", success: true });
        });
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        return res.send({ error: true, message: err.message });
    } finally {
        await session.endSession();
    }
});
app.get('/users/all', async (req, res) => {

    const requesterEmail = req.headers.email;

    const filter = { email: { $ne: requesterEmail } };

    const pipeline = [
        {
            $match: filter
        }
        ,
        {
            $project: {
                'user_metadata.picture': 1,
                'email': 1,
                'full_name': 1,
                'lastModified': 1,
                'user_metadata.full_name': 1,
                'last_sign_in_at': 1
            }
        },
        {
            $lookup: {
                from: 'friend-request',
                localField: 'email',
                foreignField: 'reciever',
                as: 'friendRequests'
            }
        },
        {
            $addFields: {
                hasSent: {
                    $cond: {
                        if: {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: '$friendRequests',
                                            as: 'friendReq',
                                            cond: {
                                                $and: [
                                                    { $eq: ['$$friendReq.sender', requesterEmail] },
                                                    { $eq: ['$$friendReq.reciever', '$email'] }
                                                ]
                                            }
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'friend-request',
                localField: 'email',
                foreignField: 'sender',
                as: 'receivedFriendRequests'
            }
        },
        {
            $addFields: {
                hasReceived: {
                    $cond: {
                        if: {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: '$receivedFriendRequests',
                                            as: 'receivedFriendReq',
                                            cond: {
                                                $and: [
                                                    { $eq: ['$$receivedFriendReq.sender', '$email'] },
                                                    { $eq: ['$$receivedFriendReq.reciever', requesterEmail] }
                                                ]
                                            }
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                friendRequests: 0,
                receivedFriendRequests: 0
            }
        },
        {
            $lookup: {
                from: 'friend-ship',
                let: { friendEmail: '$email' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$author', requesterEmail] },
                                    { $eq: ['$friend', '$$friendEmail'] }
                                ]
                            }
                        }
                    }
                ],
                as: 'friendship'
            }
        },
        {
            $match: {
                'friendship': { $eq: [] }
            }
        },

    ];

    const result = await usersCollection.aggregate(pipeline).toArray();
    res.send(result);
});
app.get('/users/friends', async (req, res) => {
    const requesterEmail = req.headers.email;
    const pipeline = [{ $match: { author: requesterEmail } }, {
        $addFields: {
            convertedUserId: {
                $toObjectId: "$userId"
            }
        }
    }, {
        $lookup: {
            from: "users",
            localField: "convertedUserId",
            foreignField: "_id",
            as: "userDetails"
        },

    },
    {
        $unwind: "$userDetails"
    },
    {
        $project: {
            _id: 0,
            timestamp: 1,
            "userDetails._id": 1,
            "userDetails.email": 1,
            "userDetails.lastModified": 1,
            "userDetails.last_sign_in_at": 1,
            'userDetails.user_metadata.full_name': 1,
            'userDetails.user_metadata.picture': 1,
        }
    }
    ];
    const result = await friendShipCollection.aggregate(pipeline).toArray();
    res.send(result);
});
app.get('/users/check-friendship/:id', async (req, res) => {
    const userId = req.params.id;
    const author = req.headers.email;
    try {
        const ifFriend = await friendShipCollection.findOne({ author, userId });
        return res.send({ isFriend: ifFriend ? true : false });
    } catch (err) {
        return res.send({ error: true, message: "Error Getting Friend Info" });
    }
});
app.get('/chats/room-messages/:id', async (req, res) => {
    const room = req.params.id;
    const pipeline = [{ $match: { room: room } }, {
        $addFields: {
            convertedUserId: {
                $toObjectId: "$author"
            }
        }
    }, {
        $lookup: {
            from: "users",
            localField: "convertedUserId",
            foreignField: "_id",
            as: "userDetails"
        },

    },
    {
        $unwind: "$userDetails"
    },
    {
        $project: {
            time: 1,
            user: 1,
            author: 1,
            room: 1,
            message: 1,
            "userDetails.email": 1,
            'userDetails.user_metadata.full_name': 1,
            'userDetails.user_metadata.picture': 1,
        }
    }
    ];
    const result = await chatCollection.aggregate(pipeline).toArray();

    return res.send(result);
});

server.listen(port, () => {
    console.log('listening to ' + port + ' port');
});












io.on("connection", socket => {
    // console.log('connected user ' + socket.id);
    socket.on('disconnect', () => {
        // console.log('disconnected user ' + socket.id);
    });
    socket.on('join_room', (roomid) => {
        socket.join(roomid);
        // console.log(`user with id ${socket.id} joined room with id ${roomid}`);
    });
    socket.on('send_message', async (data) => {
        await chatCollection.insertOne(data);
        socket.to(data.room).emit("recieve_message", data);
    });
});