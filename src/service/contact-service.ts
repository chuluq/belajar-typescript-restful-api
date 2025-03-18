import {ContactResponse, CreateContactRequest, toContactResponse} from "../model/contact-model";
import {Validation} from "../validation/validation";
import {ContactValidation} from "../validation/contact-validation";
import {User} from "@prisma/client";
import {prismaClient} from "../application/database";

export class ContactService {
    static async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
        const createRequest = Validation.validate(ContactValidation.CREATE, request);

        const record = {
            ...createRequest,
            ...{username: user.username},
        };

        const contact = await prismaClient.contact.create({
            data: record,
        });

        return toContactResponse(contact);
    }
}