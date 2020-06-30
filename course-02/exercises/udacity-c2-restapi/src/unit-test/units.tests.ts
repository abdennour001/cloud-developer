import { expect } from "chai";
import "mocha";
import {
    generatePassword,
    comparePasswords
} from "../controllers/v0/users/routes/auth.router";
import * as bcrypt from 'bcrypt';


describe("Hash a plain text password", async () => {
    it("hash a plain password and compare it", async () => {
        const result = await generatePassword("HelloBcrypt");

        const compare = await comparePasswords("HelloBcrypt", result)

        expect(compare).to.equal(true);
    });
});
