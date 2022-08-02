const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET", () => {
  describe("GET/api/topics", () => {
    test("status: 200 - responds with an array of topic objects, with a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET/api/articles/:article_id", () => {
    test("status: 200 - responds with the article object, with the following properties: author, title, article_id, body, topic, created_at and votes", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          });
        });
    });

    describe("error handling", () => {
      test("status: 404 - responds with not found if article_id doesn't exist", () => {
        return request(app)
          .get("/api/articles/1000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("error 404: not found.");
          });
      });
      test("status: 400 - responds with bad request if article_id is invalid", () => {
        return request(app)
          .get("/api/articles/banana")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });
    });
  });
});

describe("PATCH", () => {
  describe("PATCH/api/articles/:article_id", () => {
    test("status: 200 - should update the votes property by the specified amount and respond with the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toEqual(101);
        });
    });

    describe("error handling", () => {
      test("status: 404 - responds with not found if article_id doesn't exist", () => {
        return request(app)
          .patch("/api/articles/1000")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("error 404: not found.");
          });
      });
      test("status: 400 - responds with bad request if article_id is invalid", () => {
        return request(app)
          .patch("/api/articles/banana")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });
      test("status: 400 - responds with bad request if inc_votes is not a number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });
      // test("status: 200 - responds with the article unchanged if the sent request body is empty", () => {
      //   return request(app)
      //     .patch("/api/articles/1")
      //     .send({})
      //     .expect(200)
      //     .then(({ body }) => {
      //       expect(body.article).toEqual({
      //         article_id: 1,
      //         title: "Living in the shadow of a great man",
      //         topic: "mitch",
      //         author: "butter_bridge",
      //         body: "I find this existence challenging",
      //         created_at: expect.any(String),
      //         votes: 100,
      //       });
      //     });
      // });
    });
  });
});
