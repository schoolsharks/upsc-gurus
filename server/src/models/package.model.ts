import { Schema, model, Document } from 'mongoose';
import { PackageEnum } from '../types/enum';

interface PackageType extends Document {
    name: PackageEnum;
    testTemplateIds: Schema.Types.ObjectId[]; 
}

const packageSchema = new Schema<PackageType>({
    name: {
        type: String,
        enum: Object.values(PackageEnum),
        required: true
    },
    testTemplateIds: [{
        type: Schema.Types.ObjectId,
        ref: 'TestTemplate'                                                                      
    }]
}, { timestamps: true });

const Package = model<PackageType>('Package', packageSchema);
export default Package;