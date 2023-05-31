import { Request, Response } from "express";
import { db } from "..";
import { findSessionByToken, findUserByID } from "../sql/authQuery";
import { createNewPage, findUserPages } from "../sql/pageQuery";
import { createId } from "@paralleldrive/cuid2";


export async function createPage(req: Request, res: Response) {
    const { name, isPublic } = req.body;
    try {
        /**
        *  page(user_pk,id,name,public)
        */
        if (!name && !isPublic) return res.status(400).send({ message: "name and isPublic has to be specified" });

        const sessions = await db.query(findSessionByToken, [res.locals.sessionID]);
        const session = sessions.rows[0];
        const { user_pk } = session;
        if (user_pk) {
            const pages = await db.query(createNewPage, [user_pk, createId(), name, isPublic]);
            // pageName alias so that it doesnt clash with name from request body
            const { id, name: pageName, ispublic } = pages.rows[0];
            if (id) {
                res.status(200).send({ message: "Page created successfully", page: { id, name: pageName, isPublic: ispublic } });
            } else {
                res.status(400).send({ message: "Page creation error" });
            }
        } else {
            res.status(401).send({ message: "Unauthorized" });
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}


export async function getAllPages(req: Request, res: Response) {
    try {
        // lookup user by session, load all pages with user's id
        const sessions = await db.query(findSessionByToken, [res.locals.sessionID]);
        const session = sessions.rows[0];
        if (session) {
            const { user_pk } = session;
            const userPages = await db.query(findUserPages, [user_pk]);
            const pages = userPages.rows.map(({ user_pk, ...rest }) => rest); //filter out user_pk,dont wanna expose it
            if (userPages) {
                res.status(200).send({ message: "User page list loaded", pages });
            } else {
                res.status(404).send({ message: "Issue getting page list" });
            }
        } else {
            res.status(401).send({ message: "Unauthorized" });
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