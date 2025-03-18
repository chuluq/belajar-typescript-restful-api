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

describe("GET /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should able to get contact", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web).get("/api/contacts/" + contact.id).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe(contact.first_name);
        expect(response.body.data.last_name).toBe(contact.last_name);
        expect(response.body.data.email).toBe(contact.email);
        expect(response.body.data.phone).toBe(contact.phone);
    });

    it("should reject get contact if contact is not found", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web).get("/api/contacts/" + (contact.id + 1)).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PUT /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to update contact", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web).put("/api/contacts/" + contact.id).set("X-API-TOKEN", "test").send({
            first_name: "choirul",
            last_name: "chuluq",
            email: "chuluq@test.com",
            phone: "080808008080"
        });
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe("choirul");
        expect(response.body.data.last_name).toBe("chuluq");
        expect(response.body.data.email).toBe("chuluq@test.com");
        expect(response.body.data.phone).toBe("080808008080");
    });

    it("should reject update contact if data is invalid", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web).put("/api/contacts/" + contact.id).set("X-API-TOKEN", "test").send({
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        });
        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject update contact if contact is not found", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web).put("/api/contacts/" + (contact.id + 1)).set("X-API-TOKEN", "test").send({
            first_name: "choirul",
            last_name: "chuluq",
            email: "chuluq@test.com",
            phone: "080808008080"
        });
        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});