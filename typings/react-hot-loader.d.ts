declare module 'react-hot-loader' {
  interface IAppContainerProps<P> {
    component: React.ComponentClass<P> | React.StatelessComponent<P>,
    props: P
  }
  class AppContainer extends React.Component<IAppContainerProps<any>, void> {}
  class NodeModuleHot {
    accept(callback: () => void);
  }
}
interface NodeModule {
  hot:any
}