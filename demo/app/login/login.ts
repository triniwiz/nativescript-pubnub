import {LoginViewModel} from './login-view-model';
import {Page, NavigatedData} from 'ui/page';
let page;
let loginVM = new LoginViewModel();
export function navigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    console.log('navigatingTo')
}
export function loaded(args: NavigatedData) {
    page.bindingContext = loginVM;
    console.log('loaded')
}
export function login() {
    loginVM.login();
}