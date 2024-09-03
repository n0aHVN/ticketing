import mongoose, { Model } from "mongoose";
import { Password } from "../services/password";
//What it takes to create a new User
interface UserAttrs {
    email: string;
    password: string;
    //Nếu muốn thêm các attribute để truy cập từ code vào trong DB thì lấy ở đây
}
//An interface that describes the properties that a User model has
//Or what User collection looks like
interface UserModel extends mongoose.Model<UserDoc>{
    //Sẽ trả về UserDoc
    build(attrs: UserAttrs): UserDoc;
}

//What properties a single user has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
    /*
    Nếu muốn thêm property trong MongoDb, thì sẽ thêm ở chỗ này
    createdAt: Date;
    updatedAt: Date;
    */
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs); 
}
userSchema.pre('save',async function(done){
    if (this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done();
})
const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

export {User}