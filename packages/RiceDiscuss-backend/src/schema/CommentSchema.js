import {
    Comment, 
    CommentTC,
    PostDTC,
    UserTC,
} from '../models';

import mongoose from 'mongoose';

CommentTC.addFields({
    children: [CommentTC],
});

CommentTC.addRelation("creator", {
    "resolver": () => UserTC.getResolver('findByNetID'),
    
    prepareArgs: {
        netID: (source) => source.creator,
    },

    projection: {
        creator: 1,
    },
});

CommentTC.addRelation("post_id", {
    "resolver": () => PostDTC.getResolver('findById'),

    prepareArgs: {
        _id: (source) => source.post_id,
    },

    projection: {
        post_id: 1,
    },
});

CommentTC.addRelation("parent_id", {
    "resolver": () => CommentTC.getResolver('findById'),

    prepareArgs: {
        _id: (source) => source.parent_id,
    },

    projection: {
        parent_id: 1,
    },
});

CommentTC.addRelation("upvotes", {
    "resolver": () => UserTC.getResolver('findManyByNetID'),

    prepareArgs: {
        netIDs: (source) => source.upvotes,
    },

    projection: {
        upvotes: 1,
    },
});

CommentTC.addRelation("downvotes", {
    "resolver": () => UserTC.getResolver('findManyByNetID'),

    prepareArgs: {
        netIDs: (source) => source.downvotes,
    },

    projection: {
        downvotes: 1,
    },
});

CommentTC.addRelation("children", {
    "resolver": () => CommentTC.getResolver('findManyByParentID'),

    prepareArgs: {
        parent_id: (source) => source._id,
    },

    projection: {
        children: 1,
    },
});

CommentTC.addResolver({
    name: "updateCommentByID",

    args: {
        id: mongoose.Schema.Types.ObjectId,
        newComment: CommentTC.getInputTypeComposer(),
    },

    type: CommentTC,

    resolve: async ({ source, args, context, info }) => {
        var target = await Comment.findById(args.id);


    }

});

const CommentQuery = {
    commentById: CommentTC.getResolver('findById'),
    commentByIds: CommentTC.getResolver('findByIds'),
    commentByParent: CommentTC.getResolver('findManyByParentID'),
    commentByPost: CommentTC.getResolver('findManyByPostID'),
    commentOne: CommentTC.getResolver('findOne'),
    commentMany: CommentTC.getResolver('findMany'),
    commentCount: CommentTC.getResolver('count'),
};

const CommentMutation = {
    commentCreateOne: CommentTC.getResolver('createOne'),
    commentCreateMany: CommentTC.getResolver('createMany'),
    commentUpdateById: CommentTC.getResolver('updateById'),
    commentUpdateOne: CommentTC.getResolver('updateOne'),
    commentUpdateMany: CommentTC.getResolver('updateMany'),
    commentRemoveById: CommentTC.getResolver('removeById'),
    commentRemoveOne: CommentTC.getResolver('removeOne'),
    commentRemoveMany: CommentTC.getResolver('removeMany'),
};

export {
    CommentQuery,
    CommentMutation,
};
