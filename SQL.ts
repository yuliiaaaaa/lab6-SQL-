const { Client } = require('pg')
//Вказуєм параметри,які необхідні для підключення бд
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})
//підключення до нашої бд
client.connect(function(err:Error) {
    if (err) throw err;
    console.log("Connected!");
});
//Запит1
client.query(`
Select users.id as userId,users.name as userName,users.avatar_url as userAvatar,channels.description as chanel_discription,
channels.photo_url as channel_photo,channels.created_at as  channel_creation_date
from users JOIN channels ON users.id=channels.user_id 
ORDER BY  channel_creation_date desc ;
`, function (err: Error, res:any) {
    if (err) {
        console.error('Помилка виконання запиту:', err);
        return;
    }

    const videoData1 = res.rows;
    console.log('Дані про відео(запит1):', videoData1);
});

//Запит2
client.query(`
SELECT videos.id, videos.title, videos.preview_url,COUNT(likes.positive) as total
FROM videos Join likes on videos.id=likes.video_id
GROUP BY videos.id, videos.title, videos.preview_url
ORDER BY total DESC
LIMIT 5;
`, function (err: Error, res:any) {
    if (err) {
        console.error('Помилка виконання запиту:', err);
        return;
    }

    const videoData2 = res.rows;
    console.log('Дані про відео(запит2):', videoData2);
});

//Запит3
client.query(`
Select videos.id as videoId,videos.title as video_title,videos.preview_url,videos.duration,
videos.published_at
from videos
join channels on channels.id=videos.channel_id
Join subscriptions on subscriptions.channel_id=channels.id
join users on subscriptions.user_id=users.id
where users.name='Stephanie Bulger'
ORDER BY videos.published_at Desc;
`, function (err: Error, res:any) {
    if (err) {
        console.error('Помилка виконання запиту:', err);
        return;
    }

    const videoData3 = res.rows;
    console.log('Дані про відео(запит3):', videoData3);
});

//Запит4
client.query(`
SELECT channels.id, channels.description, channels.photo_url, channels.created_at, 
COUNT(subscriptions.user_id) AS total_subscribers
FROM channels
JOIN subscriptions ON channels.id = subscriptions.channel_id
WHERE channels.id = '79f6ce8f-ee0c-4ef5-9c36-da06b7f4cb76'
GROUP BY channels.id, channels.description, channels.photo_url, channels.created_at;
`, function (err: Error, res:any) {
    if (err) {
        console.error('Помилка виконання запиту:', err);
        return;
    }

    const videoData4 = res.rows;
    console.log('Дані про відео(запит4):', videoData4);
});

//Запит5
client.query(`
  SELECT videos.title,
         SUM(CASE WHEN l.positive THEN 1 ELSE 1 END) AS total_ratings
  FROM videos
  INNER JOIN likes l ON videos.id = l.video_id
  WHERE videos.published_at >= '2021-09-01'
  GROUP BY videos.title
  HAVING SUM(CASE WHEN l.positive THEN 1 ELSE 0 END) > 4
  ORDER BY total_ratings DESC
  LIMIT 10;
`, function (err: Error, res:any) {
    if (err) {
        console.error('Помилка виконання запиту:', err);
        return;
    }

    const videoData5 = res.rows;
    console.log('Дані про відео(запит5):', videoData5);
});

//Запит6
client.query(`
  Select users.name,users.avatar_url,channels.description as chanel_discription,channels.photo_url as channel_photo,
  subscriptions.level as sub_level,subscriptions.subscribed_at as sub_date
from channels 
join subscriptions on channels.id=subscriptions.channel_id 
join users on subscriptions.user_id=users.id
where users.name='Ennis Haestier'
ORDER BY CASE subscriptions.level
             WHEN 'vip' THEN 1           
             WHEN 'follower' THEN 2
             WHEN 'fan' THEN 3            
             WHEN 'standard' THEN 4
             ELSE 5        
             END,subscriptions.subscribed_at DESC;

`, function (err: Error, res:any) {
    if (err) {
        console.error('Помилка виконання запиту:', err);
        return;
    }

    const videoData6 = res.rows;
    console.log('Дані про відео(запит 6):', videoData6);
});