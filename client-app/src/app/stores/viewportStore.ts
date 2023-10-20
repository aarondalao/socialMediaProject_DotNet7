import { makeAutoObservable, reaction } from "mobx";

export default class ViewportStore {
    navigationSidebar: boolean = false;
    filterSidebar: boolean = false;
    sidebarSelector: string = "";
    width: number = 0;
    height: number = 0;
    screenWindow = null;

    constructor() {
        makeAutoObservable(this)
        this.width = window.innerWidth
        this.height = window.innerHeight;
        this.sidebarSelector = "nav";

        reaction(
            () => this.screenWindow,
            (window) => {
                if (typeof window === 'object') {
                    this.screenWindow = window
                }
            }
        );
    }

    get windowWidth() {
        return this.width;
    }

    get windowHeight() {
        return this.height
    }

    setWindow = (windowWidth: number, windowHeight: number) => {
        this.width = windowWidth;
        this.height = windowHeight;
    }

    handleSidebar = () => {
        if (this.width < 768) {
            this.navigationSidebar = false;
            this.filterSidebar = false;
        }
        else {
            this.navigationSidebar = true;
            this.filterSidebar = true;
        }
    }

    toggleAllSidebar = () => {
        this.navigationSidebar = !this.navigationSidebar;
        this.filterSidebar = !this.filterSidebar;
    }

    toggleNavVisibility = () => {
        this.navigationSidebar = !this.navigationSidebar;
        this.sidebarSelector = "nav";
    }

    toggleFilterVisibility =()  => {
        this.filterSidebar = !this.filterSidebar;
        this.sidebarSelector = "filter";
    }

    closeSidebars = () => {
        this.navigationSidebar = false;
        this.filterSidebar = false;
    }
}