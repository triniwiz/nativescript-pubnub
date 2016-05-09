import {Page, NavigatedData} from 'ui/page';
import {ChatViewModel} from './chat-view-model';
let context;
let page;
let chatVM = new ChatViewModel()
export function navigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    chatVM.instance = args.context.instance;
    chatVM.getMessages();
    chatVM.subToHome();
}
export function pageLoaded(args: NavigatedData) {
    page.bindingContext = chatVM;
}
export function sendMessage() {
    chatVM.sendMessage();
}