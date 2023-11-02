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

    toggleNavVisibility = () => {
        this.navigationSidebar = !this.navigationSidebar;
        this.filterSidebar = false;
        this.sidebarSelector = "nav";
    }

    toggleFilterVisibility =()  => {
        this.filterSidebar = !this.filterSidebar;
        this.navigationSidebar = false;
        this.sidebarSelector = "filter";
    }

    closeSidebars = () => {
        this.navigationSidebar = false;
        this.filterSidebar = false;
    }
}