//This is the storage of our secret keys, used to sign our JWT

module.exports = {
    //JWT signing key
    secretOrKey: "TG5wUSvDI2JZtsf4JdHcBXF6mfgVEPog",

    //Mongoose field encryption key
    // SHA 128
    clientKey: "41fFlBP2PthBZtu28tM9wPj5lm6uO8x7==",
    practitionerKey: "f2e00c13154d3c4e3619fe687beb5f9b==",

    mhpKey: "f2e00c13154d3c4e3619fe687beb5f9b==",
    gpKey: "a474ff050ac937e45d60bff77cbad26a==",
    adminKey: "2555eab20a5d11a05d49c904f42bd171",
    mentalHealthCarePlanKey: "4c30950ce10c357c2ddb0c35be18d26a",
};