import {
    CommentTC,
    PostDTC,
    DiscussionTC,
    EventTC,
    NoticeTC,
    JobTC,
    UserTC,
} from "../models";

import { checkLoggedIn } from "../utils/middlewares";

import pubsub from "../pubsub";

PostDTC.addFields({
    comments: [CommentTC],
});

PostDTC.addRelation("comments", {
    resolver: CommentTC.getResolver("findManyByPostID"),

    prepareArgs: {
        post_id: (source) => source._id,
    },

    projection: {
        comments: 1,
    },
});

PostDTC.addRelation("creator", {
    resolver: () => UserTC.getResolver("findOne"),

    prepareArgs: {
        filter: (source) => {
            return {
                netID: source.creator,
            };
        },
        required: true,
    },

    projection: {
        creator: 1,
    },
});

const PostQuery = {
    postById: PostDTC.getResolver("findById").withMiddlewares([checkLoggedIn]),

    postOne: PostDTC.getResolver("findOne").withMiddlewares([checkLoggedIn]),

    postMany: PostDTC.getResolver("findMany").withMiddlewares([checkLoggedIn]),

    postCount: PostDTC.getResolver("count").withMiddlewares([checkLoggedIn]),

    postPagination: PostDTC.getResolver("pagination").withMiddlewares([
        checkLoggedIn,
    ]),
};

const PostMutation = {
    discussionCreateOne: DiscussionTC.getResolver("createOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("discussionCreated", {
                discussionCreated: payload.record,
            });

            return payload;
        }),

    eventCreateOne: EventTC.getResolver("createOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("eventCreated", {
                eventCreated: payload.record,
            });

            return payload;
        }),

    noticeCreateOne: NoticeTC.getResolver("createOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);
            await pubsub.publish("noticeCreated", {
                noticeCreated: payload.record,
            });

            return payload;
        }),

    jobCreateOne: JobTC.getResolver("createOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("jobCreated", { jobCreated: payload.record });

            return payload;
        }),

    discussionUpdateById: DiscussionTC.getResolver("updateById")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("discussionUpdated", {
                discussionUpdated: payload.record,
            });

            return payload;
        }),

    eventUpdateById: EventTC.getResolver("updateById")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("eventUpdated", {
                eventUpdated: payload.record,
            });

            return payload;
        }),

    noticeUpdateById: NoticeTC.getResolver("updateById")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("noticeUpdated", {
                noticeUpdated: payload.record,
            });

            return payload;
        }),

    jobUpdateById: JobTC.getResolver("updateById")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("jobUpdated", {
                jobUpdated: payload.record,
            });

            return payload;
        }),

    discussionUpdateOne: DiscussionTC.getResolver("updateOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("discussionUpdated", {
                discussionUpdated: payload.record,
            });

            return payload;
        }),

    eventUpdateOne: EventTC.getResolver("updateOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("eventUpdated", {
                eventUpdated: payload.record,
            });

            return payload;
        }),

    noticeUpdateOne: NoticeTC.getResolver("updateOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("noticeUpdated", {
                noticeUpdated: payload.record,
            });

            return payload;
        }),

    jobUpdateOne: JobTC.getResolver("updateOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("jobUpdated", { jobUpdated: payload.record });

            return payload;
        }),

    postRemoveById: PostDTC.getResolver("removeById")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            await pubsub.publish("postRemoved", {
                postRemoved: payload.record,
            });

            return payload;
        }),

    postRemoveOne: PostDTC.getResolver("removeOne")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            pubsub.publish("postRemoved", { postRemoved: payload.record });

            return payload;
        }),

    postRemoveMany: PostDTC.getResolver("removeMany")
        .withMiddlewares([checkLoggedIn])
        .wrapResolve((next) => async (rp) => {
            const payload = await next(rp);

            pubsub.publish("postRemoved", {
                postRemoved: payload.record,
            });

            return payload;
        }),
};

const PostSubscription = {
    discussionUpdated: {
        type: DiscussionTC,

        subscribe: () => pubsub.asyncIterator("discussionUpdated"),
    },

    noticeUpdated: {
        type: NoticeTC,

        subscribe: () => pubsub.asyncIterator("noticeUpdated"),
    },

    eventUpdated: {
        type: EventTC,
        subscribe: () => pubsub.asyncIterator("eventUpdated"),
    },

    jobUpdated: {
        type: JobTC,
        subscribe: () => pubsub.asyncIterator("jobUpdated"),
    },

    discussionCreated: {
        type: DiscussionTC,

        subscribe: () => pubsub.asyncIterator("discussionCreated"),
    },

    noticeCreated: {
        type: NoticeTC,

        subscribe: () => pubsub.asyncIterator("noticeCreated"),
    },

    eventCreated: {
        type: EventTC,
        subscribe: () => pubsub.asyncIterator("eventCreated"),
    },

    jobCreated: {
        type: JobTC,
        subscribe: () => pubsub.asyncIterator("jobCreated"),
    },

    postRemoved: {
        type: PostDTC,
        subscribe: () => pubsub.asyncIterator("postRemoved"),
    },
};

export { PostQuery, PostMutation, PostSubscription };
