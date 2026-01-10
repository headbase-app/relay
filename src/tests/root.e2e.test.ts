import {describe, test, expect} from "vitest";
import supertest from "supertest"
import {createServer} from "../server";

describe('/ [GET]', () => {
	test('Root endpoint should message', async () => {
		const server = createServer({adminSecret: null});
		const response = await supertest(server).get("/").send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toMatchObject({
			message: expect.any(String),
		})
	});
});
