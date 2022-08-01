const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

describe("GET", () => {
  describe("GET/api/topics", () => {
    test("should respond with an object that contains an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
        });
    });
    test("status: 200, responds with an array of topic objects, with a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                topic_description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });
});
