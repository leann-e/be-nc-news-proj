\c nc_news_test;

CREATE TABLE topics (
    topic_description VARCHAR NOT NULL,
    slug VARCHAR NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    display_name VARCHAR NOT NULL,
    avatar_url VARCHAR NOT NULL
);

CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    author VARCHAR NOT NULL,
    body VARCHAR NOT NULL,
    created_at BIGINT,
    votes INT DEFAULT 0
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR NOT NULL,
    article_id INT REFERENCES articles(article_id),
    created_at BIGINT
);


INSERT INTO topics (topic_description, slug)
VALUES 
('The man, the Mitch, the legend', 'mitch'),
('Not dogs', 'cats'),
('what books are made of', 'paper');

INSERT INTO users (username, display_name, avatar_url)
VALUES
('butter_bridge', 'jonny', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'),
('icellusedkars', 'sam', 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'),
('rogersop', 'paul', 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'),
('lurker', 'do_nothing', 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png');

INSERT INTO articles (title, topic, author, body, created_at, votes)
VALUES
('Living in the shadow of a great man', 'mitch', 'butter_bridge', 'I find this existence challenging', 1594329060000, 100),
('Sony Vaio; or, The Laptop', 'mitch', 'icellusedkars', 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people''s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.', 1602828180000, 0),
('Eight pug gifs that remind me of mitch', 'mitch', 'icellusedkars', 'some gifs', 1604394720000, 0),
('Student SUES Mitch!', 'mitch', 'rogersop',
 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages', 1588731240000, 0),
('UNCOVERED: catspiracy to bring down democracy',
'cats', 'rogersop', 'Bastet walks amongst us, and the cats are taking arms!', 1596464040000, 0),
('A', 'mitch', 'icellusedkars', 'Delicious tin of cat food', 1602986400000, 0),
('Z', 'mitch', 'icellusedkars', 'I was hungry.', 1578406080000, 0),
('Does Mitch predate civilisation?', 'mitch', 'icellusedkars', 'Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!', 1587089280000, 0),
('They''re not exactly dogs, are they?','mitch', 'butter_bridge', 'Well? Think about it.', 1591438200000, 0),
('Seven inspirational thought leaders from Manchester UK', 'mitch', 'rogersop', 'Who are we kidding, there is only one, and it''s Mitch!', 1589433300000, 0),
('Am I a cat?', 'mitch', 'icellusedkars', 'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?', 1579126860000, 0),
('Moustache', 'mitch', 'butter_bridge', 'Have you seen the size of that thing?', 1602419040000, 0);

INSERT INTO comments (body, votes, author, article_id, created_at)
VALUES
('Oh, I''ve got compassion running out of my nose, pal! I''m the Sultan of Sentiment!', 16, 'butter_bridge', 9, 1586179020000),
('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.', 14, 'butter_bridge', 1, 1604113380000),
('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.', 100, 'icellusedkars', 1, 1583025180000),
('I carry a log — yes. Is it funny to you? It is not to me.', -100, 'icellusedkars', 1, 1582459260000),
('I hate streaming noses', 0, 'icellusedkars', 1, 1604437200000),
('I hate streaming eyes even more', 0, 'icellusedkars', 1, 1586642520000),
('Lobster pot', 0, 'icellusedkars', 1, 1589577540000),
('Delicious crackerbreads', 0, 'icellusedkars', 1, 1586899140000),
('Superficially charming', 0, 'icellusedkars', 1, 1577848080000),
('git push origin master', 0, 'icellusedkars', 3, 1592641440000),
('Ambidextrous marsupial', 0, 'icellusedkars', 3, 1600560600000),
('Massive intercranial brain haemorrhage', 0, 'icellusedkars', 1, 1583133000000),
('Fruit pastilles', 0, 'icellusedkars', 1, 1592220300000),
('What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.', 16, 'icellusedkars', 5, 1591682400000),
('I am 100% sure that we''re not completely sure.', 1, 'butter_bridge', 5, 1606176480000),
('This is a bad article name', 1, 'butter_bridge', 6, 1602433380000),
('The owls are not what they seem.', 20, 'icellusedkars', 9, 1584205320000),
('This morning, I showered for nine minutes.', 16, 'butter_bridge', 1, 1595294400000);
