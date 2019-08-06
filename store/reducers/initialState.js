const initialState = {
    contacts: {
        contactList: [],
        newContact: {
                name: '',
                lastName: '',
                email: '',
                userId: '',
                lastSeen: '',
                lastMessage: '',
                avatar: null,
            },
    },
    // ui: {
    //     signedIn: false,
    //     checkedSignIn: false,
    //     isLoading: false,
    //     errors: [],      
    // },
    profile: {
        email: null,
        password: '',
        userId: '',
        homeServer: 'https://matrix.moonshard.tech/',
        accessToken: '',
        deviceId: '',
        isLoading: false,
        error: null,
    }
}
 
export default initialState;