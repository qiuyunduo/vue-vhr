import { getRequest } from "./api"

export const initMenu=(router,store) => {
    if(store.state.routes.length > 0) {
        return;
    }
    getRequest('/system/config/menu').then(data => {
        if(data.object) {
            let fmtRoutes = formatRoutes(data.object);
            router.$addRoutes(fmtRoutes);
            store.commit('initRoutes',fmtRoutes);
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(route => {
        let {
            path,
            name,
            component,
            meta,
            iconCls,
            children
        } = route;

        if(children && children instanceof Array) {
            children = formatRoutes(children);
        }
    
        let fmtRoute = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            component(resolve) {
                let folder = '';
                if(component.startsWith('Emp')){
                    folder = "emp/";
                } else if(component.startsWith('Per')) {
                    folder = "per/";
                } else if(component.startsWith('Sal')) {
                    folder = "sal/";
                } else if(component.startsWith('Sta')) {
                    folder = "sta/";
                } else if(component.startsWith('Sys')) {
                    folder = "sys/";
                }
                require(['../views/'+folder+component],resolve)
            }
        }
        fmtRoutes.push(fmtRoute);
    });
    return fmtRoutes;
}