import { Configuration } from '@orchy-mfe/models';
import ConfigurationClient from './configuration-client/configurationClient';
import WebComponentState from './web-component-state';
declare type ConfigurationDependency = {
    content: Configuration;
    client: ConfigurationClient;
};
declare const configurationRegister: (configuration: ConfigurationDependency, webComponentState: WebComponentState) => void;
export default configurationRegister;
