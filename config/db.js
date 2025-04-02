import mongoose, { connect } from 'mongoose';

const uri = 'mongodb+srv://satriara:3QZoYZJwflkwO0Vr@cluster0.ds50w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
connect(uri, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
})


export default mongoose;




