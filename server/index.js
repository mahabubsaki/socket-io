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


app.get('/', async (req, res) => {
    res.send({ message: "s" });
});



app.put('/auth/login', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const result = await usersCollection.updateOne(filter, {
        $set: {
            ...user
        },
        $currentDate: {
            lastModified: true,
        },
    }, { upsert: true });
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
    ];

    const result = await usersCollection.aggregate(pipeline).toArray();
    res.send(result);
});

server.listen(port, () => {
    console.log('listening to ' + port + ' port');
});













io.on("connection", socket => {
    console.log('connected user ' + socket.id);
    socket.on('disconnect', () => {
        console.log('disconnected user ' + socket.id);
    });
    socket.on('join_room', (roomid) => {
        socket.join(roomid);
        console.log(`user with id ${socket.id} joined room with id ${roomid}`);
    });
    socket.on('send_message', data => {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data);
    });
});