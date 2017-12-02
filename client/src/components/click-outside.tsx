import * as React from "preact";

export const addClickOutside = (component: React.ComponentConstructor<any, any>) => component;

// interface ComponentConstructor<Props> {
//     new (props: Props, context: any): React.Component<props, any>;
// }

// interface Props {
//     rootElement: () => HTMLElement;
// }

// type Diff<T extends string, U extends string> = (
//     & { [P in T]: P }
//     & { [P in U]: never }
//     & { [x: string]: never }
//     )[T];
//
//
// export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
//
// export const addClickOutside = function<P1, P2 extends P1, S>(Comp: React.ComponentConstructor<P2, S>){
//     return class extends React.Component<Omit<P2, keyof P1>, S> {
//         render() {
//             return <Comp {...this.props}/>;
//         }
//     };
// };
//
// const Foo = ({ name }: { name: string }) => <div>{name}</div>;

// export const addClickOutside = <S, P>(_wrappedComponent: new () => React.Component<S, P>) => {
//
//     return _wrappedComponent;

// interface IProps extends React.ComponentProps<P>{
//     onClick: (e: MouseEvent) => void;
// }
//
// interface IState {
//
// }
//
// class ClickOutside extends React.Component<IProps, IState> {
//
//     private container: Element | undefined;
//
//     componentDidMount() {
//         document.addEventListener('click', e => this.handle(e), true)
//     }
//
//     componentWillUnmount() {
//         document.removeEventListener('click', e => this.handle(e), true)
//     }
//
//     handle(e: MouseEvent) {
//         const {onClick} = this.props;
//         const el = this.container;
//         if (el && !el.contains(e.target as Node)) onClick(e);
//     }
//
//     render() {
//         const {onClick: _onClick, ...props} = this.props;
//         return <_wrappedComponent {...props}></_wrappedComponent>
//     }
// }
//
// return ClickOutside;
// };

// interface Props {
//     onClick: (e: MouseEvent) => void;
//     children?: any;
// }
//
// interface State{
//
// }
//
// export class ClickOutside extends React.Component<Props, State> {
//
//     private container: Element | undefined;
//
//     render() {
//         const { children, onClick: _onClick, ...props } = this.props;
//         return (<div {...props} ref={el => this.container = el}>{children}</div>);
//     }
//
//     componentDidMount() {
//         document.addEventListener('click', e => this.handle(e), true)
//     }
//
//     componentWillUnmount() {
//         document.removeEventListener('click', e => this.handle(e), true)
//     }
//
//     handle(e: MouseEvent) {
//         const { onClick } = this.props;
//         const el = this.container;
//         if (el && !el.contains(e.target as Node)) onClick(e);
//     }
// }