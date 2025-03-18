import {ContactTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe("POST /api/contacts", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to create new contact", async () => {
        const response = await supertest(web).post("/api/contacts").set("X-API-TOKEN", "test").send({
            first_name: "Test",
            last_name: "Test",
            email: "test@test.com",
            phone: "1234567890"
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("Test");
        expect(response.body.data.last_name).toBe("Test");
        expect(response.body.data.email).toBe("test@test.com");
        expect(response.body.data.phone).toBe("1234567890");
    });

    it("should reject create new contact if data is invalid", async () => {
        const response = await supertest(web).post("/api/contacts").set("X-API-TOKEN", "test").send({
            first_name: "",
            last_name: "",
            email: "test.com",
            phone: "1234567890000000000000000000000000000"
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});