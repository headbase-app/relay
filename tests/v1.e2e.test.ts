import {describe, test, expect} from "vitest";
import supertest from "supertest"
import {createServer} from "../src/server";

describe('/v1 [GET]', () => {
	test('v1 endpoint should return server info', async () => {
		const server = createServer({
			serverVersion: "test1",
			adminSecret: null,
		});
		const response = await supertest(server).get("/v1").send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toMatchObject({
			version: "test1",
			isPublic: true,
		})
	});

	test('Given an admin secret, v1 endpoint should return isPublic: false', async () => {
		const server = createServer({
			serverVersion: "test1",
			adminSecret: "secret",
		});
		const response = await supertest(server).get("/v1").send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toMatchObject({
			version: "test1",
			isPublic: false,
		})
	});
});
