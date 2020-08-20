// add sponsors to dynamodb tables

const AWS = require('aws-sdk');
const UUID = require('uuid');

AWS.config.update({ region: 'us-east-1' });

// const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const ddb = new AWS.DynamoDB.DocumentClient();

const TABLE = 'sponsorship-info';
// const STAGE_LIST = ['prod', 'stage', 'dev', 'test'];
const STAGE_LIST = ['prod', 'stage', 'test'];

const SPONSOR_LIST = [
    {
        "tier": "Silver",
        "name": "Google",
        "events_hosted": ["Intro to Angular", "Android Workshop"],
        "logo_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"
    },
    {
        "tier": "Gold",
        "name": "University of Maryland",
        "logo_image_url": "https://umd.edu/sites/umd.edu/files/UMD_Logo-white.png",
        "info": "UMD is a university in College Park, Maryland."
    },
    {
        "tier": "Platinum",
        "name": "NSA",
        "logo_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Seal_of_the_U.S._National_Security_Agency.svg/1200px-Seal_of_the_U.S._National_Security_Agency.svg.png",
        "info": "The National Security Agency (NSA) is a national-level intelligence agency of the United States Department of Defense, under the authority of the Director of National Intelligence.",
        "prizes": ["Nintendo Switch", "2 GTX 1080s"]
    },
    {
        "tier": "Gold",
        "name": "Microsoft",
        "logo_image_url": "https://3er1viui9wo30pkxh1v2nh4w-wpengine.netdna-ssl.com/wp-content/uploads/2016/05/Microsoft-Logo-2012.jpg",
        "info": "Microsoft develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
        "prizes": ["Surface Pro", "Surface mouse"],
        "events_hosted": ["Azure workshop"]
    },
    {
        "tier": "Gold",
        "name": "Apple",
        "logo_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1000px-Apple_logo_black.svg.png",
        "info": "Apple sells digital devices, best-known for their iPhone, iPad and Macbook lineups.",
        "prizes": ["Surface Pro", "Surface mouse"],
        "events_hosted": ["Intro to Swift"]
    },
    {
        "tier": "Gold",
        "name": "Amazon",
        "logo_image_url": "https://i.insider.com/539f3ffbecad044276726c01?width=1100&format=jpeg&auto=webp",
        "info": "Amazon started off as an online bookstore. Now they sell basically everything, from A to Z.",
        "prizes": ["Echo"],
        "events_hosted": ["Intro to AWS", "Alexa Workshop"]
    },
    {
        "tier": "Gold",
        "name": "Facebook",
        "logo_image_url": "https://1000logos.net/wp-content/uploads/2016/11/Facebook-Logo.png",
        "info": "Facebook is the preeminent social media platform, founded by Mark Zuckerburg.",
        "prizes": ["Oculus Quest"],
        "events_hosted": ["Intro to React"]
    },
]

// const SPONSOR_LIST = [
//     {
//         "tier": "Silver",
//         "name": "Google",
//         "events_hosted": ["Intro to Angular", "Android Workshop"],
//         "logo_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"
//     },
// ];


add_sponsor = async (tableName, stage, sponsor) => {
    const fullTableName = `platform-${stage}-${tableName}`;

    // const body = JSON.parse(event.body);
    const body = sponsor;

    const id = UUID.v4();

    const params = {
        TableName: fullTableName,
        Item: {},
    };

    body.id = id;

    // dynamically add post request body params to document
    Object.keys(body).forEach((k) => {
        params.Item[k] = body[k];
    });

    // Call DynamoDB to add the item to the table
    await ddb.put(params).promise();

    console.log("success");
};

STAGE_LIST.forEach((stage) => {
    SPONSOR_LIST.forEach((sponsor) => {
        let res = add_sponsor(TABLE, stage, sponsor);
    });
});