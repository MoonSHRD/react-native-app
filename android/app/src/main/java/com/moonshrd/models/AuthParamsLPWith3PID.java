package com.moonshrd.models;

import org.matrix.androidsdk.rest.model.login.AuthParams;

public class AuthParamsLPWith3PID extends AuthParams {
    public ThirdPartyIdentifier identifier;
    public String password;

    public AuthParamsLPWith3PID() {
        super("m.login.password");
        identifier = new ThirdPartyIdentifier();
    }

    public class Identifier {
        public String type;

        public Identifier(String type) {
            this.type = type;
        }
    }

    public class ThirdPartyIdentifier extends Identifier {
        public String medium;
        public String address;

        public ThirdPartyIdentifier() {
            super("m.id.thirdparty");
        }
    }
}
