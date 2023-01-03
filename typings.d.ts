export interface Post{
    _id: string;
    _createAt: string;
    title: string;
    author: {
        name: string,
        image: string
    };
    description: string;
    mainImage: {
        asset:{
            url: string;
        };

    };
    slug:{
        current: string;
    };
    body: [object]
    comments: Comment[]
}

export interface Comment{
    approve: boolean;
    comment: string;
    email: string;
    name: string;
    post:{
        _type: string,
        _ref: string
    },
    _createAt: string;
    _id: string;
    _rev: string;
    __type: string;
    _updateAt: string;
}