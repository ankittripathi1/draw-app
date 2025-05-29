import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Signup validation error:", parsedData.error);
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        console.log("User created", user);
        res.json({
            userId: user.id
        })
    } catch(e) {
        console.log("Error creating user", e);
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Signin validation error:", parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // TODO: Compare the hashed pws here
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })
    console.log("User found", user);

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }


    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    console.log("User signed in", user.id);
    console.log("Token generated", token);

    res.json({
        token
    })
})

app.post("/room", middleware, async (req, res) => {
    console.log("Creating room");

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        console.log(parsedData.error);
        return;
    }
    // @ts-ignore: TODO: Fix this
    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })
        console.log("Room created", room);

        res.json({
            roomId: room.id
        })
    } catch(e) {
        console.log("Error creating room", e);
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/rooms", middleware, async (req, res) => {
    try {
        // @ts-ignore: TODO: Fix this
        const userId = req.userId;
        
        const rooms = await prismaClient.room.findMany({
            where: {
                adminId: userId
            },
            include: {
                _count: {
                    select: {
                        chats: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const roomsWithChatCount = rooms.map(room => ({
            id: room.id,
            slug: room.slug,
            createdAt: room.createdAt,
            adminId: room.adminId,
            _count: {
                chats: room._count.chats
            }
        }));

        res.json({
            rooms: roomsWithChatCount
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            message: "Failed to fetch rooms"
        });
    }
});

app.get("/rooms/public", async (req, res) => {
    try {
        const rooms = await prismaClient.room.findMany({
            include: {
                admin: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        chats: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 20 // Limit to recent 20 rooms
        });

        const roomsWithDetails = rooms.map(room => ({
            id: room.id,
            slug: room.slug,
            createdAt: room.createdAt,
            adminName: room.admin.name,
            chatCount: room._count.chats
        }));

        res.json(roomsWithDetails);
    } catch (error) {
        console.error("Error fetching public rooms:", error);
        res.status(500).json({
            message: "Failed to fetch public rooms"
        });
    }
});

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(3001);