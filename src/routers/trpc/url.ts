
import { urlController } from '../../controllers/url.controller';
import {router} from './context';

export const urlRouter=router(urlController)
//to read anything from DB we use query and to create,update,delete we use mutations