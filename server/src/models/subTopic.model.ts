import { Schema, model, Document, Mongoose} from 'mongoose';

interface SubTopicType extends Document{
    subTopic : string,
    topicId:Schema.Types.ObjectId
}

const subTopicSchema = new Schema<SubTopicType>({
    subTopic :{
        type: String,
        require: true,
        unique:true,
        trim:true
    },
    topicId:{
        type:Schema.Types.ObjectId,
        ref: 'Topic',
        require: true
    }
},{
    timestamps:true
});

const SubTopic  = model<SubTopicType>('subTopic', subTopicSchema);
export default SubTopic;