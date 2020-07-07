import sanitizeHtml from "sanitize-html";

import { Post, Comment, User } from "../models";
import { CHECK_HTML_CONFIG } from "../config";

function checkLoggedIn(resolve, source, args, context, info) {
    if (context.netID) {
        return resolve(source, args, context, info);
    }

    throw new Error("Not logged in!");
}

function userCheckCreate(resolve, source, args, context, info) {
    if (context.netID === args.record.creator) {
        return resolve(source, args, context, info);
    }

    throw new Error("User cannot create content as different user!");
}

async function userCheckComment(resolve, source, args, context, info) {
    const comment = await Comment.findById(args._id);

    if (comment.creator === context.netID) {
        return resolve(source, args, context, info);
    }

    throw new Error("User does not have edit access to this comment");
}

async function userCheckPost(resolve, source, args, context, info) {
    const post = await Post.findById(args.record._id);

    if (post.creator === context.netID) {
        return resolve(source, args, context, info);
    }

    throw new Error("User does not have access to edit this post");
}

async function userCheckUserFilter(resolve, source, args, context, info) {
    if (args.filter.netID === context.netID) {
        return resolve(source, args, context, info);
    }

    throw new Error("User is not the same");
}

async function userCheckUserId(resolve, source, args, context, info) {
    const user = await User.findById(args._id);

    if (user.netID === context.netID) {
        return resolve(source, args, context, info);
    }

    throw new Error("User is not the same");
}

async function checkHTML(resolve, source, args, context, info) {
    if (args.record.body) {
        args.record.body = sanitizeHtml(args.record.body, CHECK_HTML_CONFIG);
    }

    return resolve(source, args, context, info);
}

export {
    checkLoggedIn,
    checkHTML,
    userCheckCreate,
    userCheckComment,
    userCheckPost,
    userCheckUserFilter,
    userCheckUserId,
};