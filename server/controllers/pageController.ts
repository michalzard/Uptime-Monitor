import { Request, Response } from "express";
import { readCookiesFromHeaders } from "../utils/cookies";
import { db } from "..";
import { findUserByID } from "../sql/authQuery";
import { createNewPage } from "../sql/pageQuery";
import { createId } from "@paralleldrive/cuid2";


export async function createPage(req: Request, res: Response) {
    const cookies = readCookiesFromHeaders(req);
    const { name, isPublic } = req.body;
    try {
        /**
        *  page(user_pk,id,name,public)
        */
        if (!name && !isPublic) return res.status(400).send({ message: "Name & isPublic has to be specified" });

        const users = await db.query(findUserByID, [cookies?.sessionID]);
        const { pk } = users.rows[0];
        if (pk) {
            const pages = await db.query(createNewPage, [pk, createId(), name, isPublic]);
            const { id, name: pageName, ispublic } = pages.rows[0];
            if (id) {
                res.status(200).send({ message: "Page created successfully", page: { id, pageName, isPublic: ispublic } });
            } else {
                res.status(400).send({ message: "Page creation error" });
            }
        } else {
            res.status(404).send();
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

// export async function getPageById(req: Request, res: Response) {
//     const cookies = readCookiesFromHeaders(req);
//     const { id } = req.body;
//     try {
//         /**
//         *  page(user_pk,id,name,public)
//         */
//         const users = await db.query(findUserByID, [cookies?.sessionID]);
//         const { pk } = users.rows[0];
//         if (pk) {
//             // const pages = await db.query(createNewPage, [pk, createId(), name, isPublic]);
//             // const { id, name: pageName, ispublic } = pages.rows[0];
//             // if (id) {
//             //     res.status(200).send({ message: "Page created successfully", page: { id, pageName, isPublic: ispublic } });
//             // } else {
//             //     res.status(400).send({ message: "Page creation error" });
//             // }
//         } else {
//             res.status(404).send();
//         }
//     } catch (err) {
//         // handle error
//         console.log(err);
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// }