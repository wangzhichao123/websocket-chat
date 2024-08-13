/* eslint-disable */
class User {
    name: string;
    password: string;
    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    toString() {
        return this.name;
    }
}

// 示例用法
// const user = new User("John", "password123");
// console.log("User Name:", user.getName());
// console.log("Password:", user.getPassword());
// console.log("ToString:", user.toString());

export default {User};
