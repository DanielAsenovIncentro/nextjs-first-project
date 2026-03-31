import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// General data
export async function fetchPosts() {
    return await sql`SELECT * FROM posts`;
}

export async function fetchComments() {
    return await sql`SELECT * FROM comments`;
}

export async function fetchUsers() {
    return await sql`SELECT * FROM users`;
}

export async function fetchLikedPosts() {
    return await sql`SELECT * FROM liked_posts`;
}

export async function fetchCommunities() {
    return await sql`SELECT * FROM communities ORDER BY id`;
}

// More specific data
export async function fetchPostPageDataAsUser(postID: number, userID: number) {
    return await sql`
    SELECT posts.id, posts.created_at as date, posts.title, posts.content, posts.author, posts.has_image, posts.community as community_id,
        users.name as user_name, users.has_profile_image,
        (SELECT COUNT(id) FROM comments WHERE comments.post = posts.id) as comments,
        (SELECT COUNT(user) FROM liked_posts WHERE posts.id = liked_posts.post) as likes,
        (SELECT CASE WHEN EXISTS (SELECT post FROM liked_posts WHERE liked_posts.user = ${userID} AND liked_posts.post = posts.id) THEN 1 ELSE 0 END) as liked,
        (SELECT name FROM communities WHERE communities.id = posts.community) as community_name,
        (SELECT color FROM communities WHERE communities.id = posts.community) as community_color
    FROM posts INNER JOIN users ON posts.author = users.id
    WHERE posts.id = ${postID}`;
}

export async function fetchPostComments(postID: number) {
    return await sql`SELECT * FROM comments WHERE post = ${postID}`;
}

export async function fetchUserById(userID: number | undefined) {
    if (userID == undefined) return undefined;
    return await fetchDefinedUserById(userID);
}

export async function fetchDefinedUserById(userID: number) {
    return await sql`SELECT id, name, has_profile_image, has_banner_image, created_at FROM users WHERE id = ${userID}`;
}

export async function fetchFullUserById(userID: number) {
    return await sql`SELECT * FROM users WHERE id = ${userID}`;
}

export async function fetchHomePostDataAsUser(userID: number) { // Necessary data to display posts on the home page
    return await sql`
    SELECT
        posts.id, posts.created_at as date, title, content, posts.community as community_id, has_image,
        users.id as user_id, users.name as user_name, users.has_profile_image as has_profile_image,
        (SELECT COUNT(id) FROM comments WHERE comments.post = posts.id) as comments,
        (SELECT COUNT(user) FROM liked_posts WHERE posts.id = liked_posts.post) as likes,
        (SELECT CASE WHEN EXISTS (SELECT post FROM liked_posts WHERE liked_posts.user = ${userID} AND liked_posts.post = posts.id) THEN 1 ELSE 0 END) as liked,
        (SELECT name FROM communities WHERE communities.id = posts.community) as community_name,
        (SELECT color FROM communities WHERE communities.id = posts.community) as community_color
    FROM posts INNER JOIN users ON posts.author = users.id
    ORDER BY date
    `;
}

export async function fetchPostCommentsWithUserInfo(postID: number) {
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Skeleton testing
    return await sql`SELECT
            users.id as user_id, users.name, users.has_profile_image as has_profile_image, comments.id, comments.content, comments.created_at as date
        FROM comments INNER JOIN users ON users.id = comments.author
        WHERE comments.post = ${postID}
        ORDER BY comments.created_at`;
}

export async function fetchLikedPostsByUser(userID: number) {
    return await sql`SELECT post FROM liked_posts WHERE liked_posts.user = ${userID}`;
}

export async function getChatBetween(user1ID: number, user2ID: number) {
    return await sql`SELECT * FROM dm_channels WHERE (user1 = ${user1ID} AND user2 = ${user2ID}) OR (user1 = ${user2ID} AND user2 = ${user1ID})`;
}

export async function getMessagesBetween(user1ID: number, user2ID: number) {
    return await sql`
        SELECT * FROM messages WHERE messages.channel = (
            SELECT id from dm_channels WHERE (user1 = ${user1ID} AND user2 = ${user2ID}) OR (user1 = ${user2ID} AND user2 = ${user1ID})
        ) ORDER BY created_at ASC;
    `;
}

export async function fetchUsersExcept(userID: number) {
    return await sql`SELECT * FROM users WHERE id != ${userID}`;
}

export async function fetchProfilePostsByUser(viewAs: number, userID: number) {
    return await sql`
    SELECT posts.id, posts.created_at as date, title, content, has_image, posts.community as community_id,
        users.id as user_id, users.name as user_name, users.has_profile_image as has_profile_image,
        (SELECT COUNT(id) FROM comments WHERE comments.post = posts.id) as comments,
        (SELECT COUNT(user) FROM liked_posts WHERE posts.id = liked_posts.post) as likes,
        (SELECT CASE WHEN EXISTS (SELECT post FROM liked_posts WHERE liked_posts.user = ${viewAs} AND liked_posts.post = posts.id) THEN 1 ELSE 0 END) as liked,
        (SELECT name FROM communities WHERE communities.id = posts.community) as community_name,
        (SELECT color FROM communities WHERE communities.id = posts.community) as community_color
    FROM posts INNER JOIN users ON posts.author = users.id
    WHERE posts.author = ${userID} ORDER BY date`;
}

export async function fetchUserPageInfo(userID: number) {
    return await sql`SELECT id, name, has_profile_image, has_banner_image, created_at,
        (SELECT COUNT(id) FROM comments WHERE comments.author = users.id) as comments,
        (SELECT COUNT(user) FROM liked_posts WHERE liked_posts.user = users.id) as posts_liked,
        (SELECT COUNT(id) FROM posts WHERE posts.author = users.id) as posts_created,
        (SELECT COUNT(user) FROM liked_posts WHERE post IN (SELECT id FROM posts WHERE posts.author = users.id)) as post_likes
        FROM users
    WHERE users.id = ${userID}`;
}

export async function getPostsAmount() {
    return await sql`SELECT COUNT(id) FROM posts`;
}

export async function fetchCommunityPageData(communityID: number) {
    return await sql`SELECT communities.id, communities.created_at, communities.name, communities.creator, communities.color, communities.description,
        (SELECT COUNT(id) FROM posts WHERE posts.community = communities.id) as posts,
        (SELECT COUNT(user) FROM liked_posts WHERE liked_posts.post IN (SELECT id FROM posts WHERE posts.community = communities.id)) as total_likes
    FROM communities
    WHERE communities.id = ${communityID} LIMIT 1`;
}

export async function fetchCommunityPosts(viewAs: number, communityID: number) {
    return await sql`
    SELECT posts.id, posts.created_at as date, title, content, has_image, posts.community as community_id,
        users.id as user_id, users.name as user_name, users.has_profile_image as has_profile_image,
        (SELECT COUNT(id) FROM comments WHERE comments.post = posts.id) as comments,
        (SELECT COUNT(user) FROM liked_posts WHERE posts.id = liked_posts.post) as likes,
        (SELECT CASE WHEN EXISTS (SELECT post FROM liked_posts WHERE liked_posts.user = ${viewAs} AND liked_posts.post = posts.id) THEN 1 ELSE 0 END) as liked,
        (SELECT name FROM communities WHERE communities.id = posts.community) as community_name,
        (SELECT color FROM communities WHERE communities.id = posts.community) as community_color
    FROM posts INNER JOIN users ON posts.author = users.id
    WHERE posts.community = ${communityID} ORDER BY date`;
}