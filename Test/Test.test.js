const mongoose = require('mongoose');
const AdminUserModel = require('../models/admin');
const PractitionerUserModel = require('../models/practitioner');
const UserModel = require('../models/User');
const mongoDbUrl = require('../config/env.env');
require('dotenv').config();
const PractitionerUserData = {
    Username: "Practitioner" + Math.random(),
    password: "Practitioner123" + Math.random(),
    givenname: "",
    familyname: "",
    Email: "",
    Phone: null
}


const AdminUserData = { Username: 'test' + Math.random() + '@gmail.com', Password: 'shdgj' + Math.random() + '@gmail.com' };

const UserData = {
    Username: "user" + Math.random(),
    password: "user123" + Math.random(),
    givenname: "",
    familyname: "",
    Email: "",
    Phone: null
}
//MONGO_URL = "mongodb://localhost:27017/sit780"
MONGO_URL = ${{ db }}
describe('User Model Test for ALL feature file', () => {
    console.log('Connection url => ', MONGO_URL);
    // By using mongoose.connect
    beforeAll(async() => {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, (err) => {
            if (err) {
                console.error(err);
               // process.exit(1);
            }
        });
    });

    it('create & save Admin user successfully', async() => {
        const validUser = new AdminUserModel(AdminUserData);
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.Username).toBe(AdminUserData.Username);
        expect(savedUser.Password).toBe(AdminUserData.Password);
        //test new variable to check whatever if its defined 
        expect(savedUser.Usernames).toBeUndefined();
        //test new variable to check whatever if its defined 
        expect(savedUser.Passwords).toBeUndefined();
    });


    // Test Schema is working!!!
    it('insert Admin user successfully, but the field does not defined in schema should be undefined', async() => {
        const userWithInvalidField = new AdminUserModel({ Username: 'Admin' + Math.random() });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.nickkname).toBeUndefined();
    });

    //PRACTITIONER TESTING 
    it('create & save Practitioner user successfully', async() => {
        const validUser = new PractitionerUserModel(PractitionerUserData);
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.Username).toBe(PractitionerUserData.Username);
        expect(savedUser.password).toBe(PractitionerUserData.password);
        expect(savedUser.givenname).toBe(PractitionerUserData.givenname);
        expect(savedUser.familyname).toBe(PractitionerUserData.familyname);
        expect(savedUser.Email).toBe(PractitionerUserData.Email);
        expect(savedUser.Phone).toBe(PractitionerUserData.Phone);
        //test new variable to check whatever if its defined
        expect(savedUser.Usernames).toBeUndefined();
        //test new variable to check whatever if its defined
        expect(savedUser.Passwords).toBeUndefined();
    });


    // Test Schema is working!!!
    it('insert Practitioner user successfully, but the field does not defined in schema should be undefined', async() => {
        const userWithInvalidField = new PractitionerUserModel({ Username: "Practitioner" + Math.random() });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.NameLasts).toBeUndefined();
    });

    //USER TESTING 
    it('create & save user successfully', async() => {
        const validUser = new UserModel(UserData);
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.Username).toBe(UserData.Username);
        expect(savedUser.password).toBe(UserData.password);
        expect(savedUser.givenname).toBe(UserData.givenname);
        expect(savedUser.familyname).toBe(UserData.familyname);
        expect(savedUser.Email).toBe(UserData.Email);
        expect(savedUser.Phone).toBe(UserData.Phone);
        //test new variable to check whatever if its defined
        expect(savedUser.Usernames).toBeUndefined();
        //test new variable to check whatever if its defined
        expect(savedUser.Passwords).toBeUndefined();
    });


    // Test Schema is working!!!
    it('insert user successfully, but the field does not defined in schema should be undefined', async() => {
        const userWithInvalidField = new UserModel({ Username: "User" + Math.random() });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.NameLasts).toBeUndefined();
    });

    //closing connection
    afterAll(async() => {
        await mongoose.connection.close();
    });
})
