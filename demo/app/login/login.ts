import {LoginViewModel} from './login-view-model';
import {Page, NavigatedData} from 'ui/page';
let page;
let loginVM = new LoginViewModel();
export function navigatingTo(args: NavigatedData) {
    page = <Page>args.object;
}
export function loaded(args: NavigatedData) {
    page.bindingContext = loginVM;
}
export function login() {
    loginVM.login();
}