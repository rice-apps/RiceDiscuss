import {
    Discussion,
    CommentTC,
    PostDTC,
    DiscussionTC,
    EventTC,
    NoticeTC,
    JobTC,
    UserTC,
} from '../models';

DiscussionTC.addFields({
    comments: [CommentTC],
});

EventTC.addFields({
    comments: [CommentTC],
});

JobTC.addFields({
    comments: [CommentTC],
});

DiscussionTC.addRelation("comments", {
    "resolver": CommentTC.getResolver('findMany'),

    prepareArgs: {
        _id: (source) => source._id,
    },

    projection: {
        comments: 1,
    },
});

EventTC.addRelation("comments", {
    "resolver": CommentTC.getResolver('findMany'),

    prepareArgs: {
        _id: (source) => source._id,
    },

    projection: {
        comments: 1,
    },
});

JobTC.addRelation("comments", {
    "resolver": CommentTC.getResolver('findMany'),

    prepareArgs: {
        _id: (source) => source._id,
    },

    projection: {
        comments: 1,
    },
});

PostDTC.addRelation("creator", {
    "resolver": () => UserTC.getResolver('findByNetID'),
    
    prepareArgs: {
        netID: (source) => source.creator,
        required: true,
    },

    projection: {
        creator: 1,
    },

});

// DiscussionTC.addResolver({
//     name: "createOneDiscussion",

//     args: {
//         kind: 'String',
//         title: 'String',
//         body: 'String',
//         creator: 'String',
//     },

//     type: DiscussionTC,

//     resolve: async ({ source, args, context, info }) => {
//         return await Discussion.create({
//             kind: args.kind,
//             title: args.title,
//             body: args.body,
//             creator: args.creator,
//         });
//     },
// })

const PostQuery = {
    discussionById: DiscussionTC.getResolver('findById'),
    eventById: EventTC.getResolver('findById'),
    noticeById: NoticeTC.getResolver('findById'),
    jobById: JobTC.getResolver('findById'),
    
    discussionByIds: DiscussionTC.getResolver('findByIds'),
    eventByIds: EventTC.getResolver('findByIds'),
    noticeByIds: NoticeTC.getResolver('findByIds'),
    jobByIds: JobTC.getResolver('findByIds'),
    
    discussionFindOne: DiscussionTC.getResolver('findOne'),
    eventFindOne: EventTC.getResolver('findOne'),
    noticeFindOne: NoticeTC.getResolver('findOne'),
    jobFindOne: JobTC.getResolver('findOne'),
    
    discussionMany: DiscussionTC.getResolver('findMany'),
    eventMany: EventTC.getResolver('findMany'),
    noticeMany: NoticeTC.getResolver('findMany'),
    jobMany: JobTC.getResolver('findMany'),
    
    discussionCount: DiscussionTC.getResolver('count'),
    eventCount: EventTC.getResolver('count'),
    noticeCount: NoticeTC.getResolver('count'),
    jobCount: JobTC.getResolver('count'),
};

const PostMutation = {
    discussionCreateOne: DiscussionTC.getResolver('createOne'),
    eventCreateOne: EventTC.getResolver('createOne'),
    noticeCreateOne: NoticeTC.getResolver('createOne'),
    jobCreateOne: JobTC.getResolver('createOne'),

    discussionCreateMany: DiscussionTC.getResolver('createMany'),
    eventCreateMany: EventTC.getResolver('createMany'),
    noticeCreateMany: NoticeTC.getResolver('createMany'),
    jobCreateMany: JobTC.getResolver('createMany'),

    discussionUpdateById: DiscussionTC.getResolver('updateById'),
    eventUpdateById: EventTC.getResolver('updateById'),
    noticeUpdateById: NoticeTC.getResolver('updateById'),
    jobUpdateById: JobTC.getResolver('updateById'),

    discussionUpdateOne: DiscussionTC.getResolver('updateOne'),
    eventUpdateOne: EventTC.getResolver('updateOne'),
    noticeUpdateOne: NoticeTC.getResolver('updateOne'),
    jobUpdateOne: JobTC.getResolver('updateOne'),

    discussionCreate: DiscussionTC.getResolver('createOne'),
    eventCreate: EventTC.getResolver('createOne'),
    noticeCreate: NoticeTC.getResolver('createOne'),
    jobCreate: JobTC.getResolver('createOne'),

    discussionUpdateMany: DiscussionTC.getResolver('updateMany'),
    eventUpdateMany: EventTC.getResolver('updateMany'),
    noticeUpdateMany: NoticeTC.getResolver('updateMany'),
    jobUpdateMany: JobTC.getResolver('updateMany'),
    
    postRemoveById: PostDTC.getResolver('removeById'),
    postRemoveOne: PostDTC.getResolver('removeOne'),    
    postRemoveMany: PostDTC.getResolver('removeMany'),

};

const PostSubscription = {
    discussionUpdated: {
        type: PostDTC,
        args: {
            // TODO: figure out types of args
        }
    }
}

export {
    PostQuery,
    PostMutation,
};