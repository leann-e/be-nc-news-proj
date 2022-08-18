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
    test("status: 200 - responds with an article object for the correct article_id", () => {
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
            comment_count: 11,
          });
        });
    });

    test("status: 200 - adds a comment_count key which has a value of the total number of comments for that specific article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe(11);
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

  describe("GET/api/users", () => {
    test("status: 200 - responds with an array of objects with username, name and avatar_url properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET/api/articles", () => {
    test("status: 200 - responds with an article array of article objects sorted in descending order by date, with all the respective properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(12);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    test("status: 200 - should return the array of article objects sorted in descending order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(12);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    describe("GET/api/articles (queries)", () => {
      test("status: 200 - accepts multiple queries", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=ASC&topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(11);
            expect(body.articles).toBeSortedBy("votes", { ascending: true });
            body.articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
      test("status: 200 - accepts a sort_by query which sorts the articles by the default order (descending)", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(12);
            expect(body.articles).toBeSortedBy("title", { descending: true });
          });
      });

      test("status: 200 - accepts a topic query which sorts the articles by the default order (descending)", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(1);
            expect(body.articles).toBeSortedBy("cat", { descending: true });
          });
      });

      test("status: 200 - accepts a order query which sorts the articles by asc/desc", () => {
        return request(app)
          .get("/api/articles?order=ASC")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(12);
            expect(body.articles).toBeSortedBy("created_at", {
              ascending: true,
            });
          });
      });
    });

    describe("error handling", () => {
      test("status: 400 - responds with bad request if sort_by query is invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });

      test("status: 400 - responds with bad request if order query is invalid", () => {
        return request(app)
          .get("/api/articles?order=invalid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });

      test("status: 404 - responds with not found if topic query doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=nonexistant")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("error 404: not found.");
          });
      });
    });
  });

  describe("GET/api/articles/:article_id/comments", () => {
    test("status: 200 - responds with an array of comments for the given article_id with the correct key:value pairs", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(11);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                article_id: 1,
                body: expect.any(String),
              })
            );
          });
        });
    });

    describe("error handling", () => {
      test("status: 400 - responds with bad request if article_id is invalid", () => {
        return request(app)
          .get("/api/articles/banana/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });

      test("status: 404 - responds with not found if article_id doesnt exist", () => {
        return request(app)
          .get("/api/articles/1000/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("error 404: not found.");
          });
      });
      test("status: 200 - responds with an empty array if the article_id exists, but no comments are found", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toEqual([]);
          });
      });
    });
  });
});

describe("POST", () => {
  describe("POST/api/articles/:article_id/comments", () => {
    test("status: 201 - should take an object with a username and body property, and respond with the posted comment", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ username: "butter_bridge", body: "nice" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            body: "nice",
            votes: 0,
            author: "butter_bridge",
            article_id: 3,
            comment_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    describe("error handling", () => {
      test("status: 400 - responds with bad request if article id invalid", () => {
        return request(app)
          .post("/api/articles/banana/comments")
          .send({ username: "butter_bridge", body: "nice" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });

      test("status: 400 - responds with bad request if body is missing", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: "butter_bridge", body: "" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });

      test("status: 400 - responds with bad request if username is missing", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: "", body: "aaaaa" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });

      test("status: 404 - responds with not found if article_id doesn't exist", () => {
        return request(app)
          .post("/api/articles/1000/comments")
          .send({ username: "butter_bridge", body: "nice" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("error 404: not found.");
          });
      });

      test("status: 404 - responds with not found if username doesn't exist", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: "unknown", body: "hi" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("error 404: not found.");
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

describe("DELETE", () => {
  describe.only("DELETE api/comments/:comment_id", () => {
    test("status: 204 - should delete a comment when passed a valid comment id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    describe("error handling", () => {
      test("status: 400 - responds with bad requst if comment_id is invalid", () => {
        return request(app)
          .delete("/api/comments/invalid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("error 400: bad request.");
          });
      });

      test("status: 404 - responds with not found if comment_id doesn't exist", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("error 404: not found.");
          });
      });
    });
  });
});
