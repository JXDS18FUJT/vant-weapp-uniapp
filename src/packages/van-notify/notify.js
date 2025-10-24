import {
  WHITE
} from '../common/color';

// interface NotifyOptions {
//   type?: 'primary' | 'success' | 'danger' | 'warning';
//   color?: string;
//   zIndex?: number;
//   top?: number;
//   message: string;
//   context?: any;
//   duration?: number;
//   selector?: string;
//   background?: string;
//   safeAreaInsetTop?: boolean;
//   onClick?: () => void;
//   onOpened?: () => void;
//   onClose?: () => void;
// }

const defaultOptions = {
  selector: 'van-notify',
  type: 'danger',
  message: '',
  background: '',
  duration: 3000,
  zIndex: 110,
  top: 0,
  color: WHITE,
  safeAreaInsetTop: false,
  onClick: () => {},
  onOpened: () => {},
  onClose: () => {},
};

let currentOptions = {
  ...defaultOptions
};

function parseOptions(
  message
) {
  if (message == null) {
    return {};
  }

  return typeof message === 'string' ? {
    message
  } : message;
}

function getContext() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

export default function Notify(options) {
  options = {
    ...currentOptions,
    ...parseOptions(options)
  };

  const context = options.context || getContext();
  const notify = context.$refs[options.selector];

  delete options.context;
  delete options.selector;

  if (notify) {
    console.log(notify,options)
    //notify.setData(options);
    notify.type = options.type
    notify.message = options.message||''
    notify.zIndex = options.zIndex||110
    notify.color= options.color||'#fff'
    notify.duration= options.duration||3000
    notify.background = options.background||''
    notify.safeAreaInsetTop = options.safeAreaInsetTop||false
    notify.show();
    return notify;
  }

  console.warn('未找到 van-notify 节点，请确认 selector 及 context 是否正确');
}

Notify.clear = function(options ) {
  options = {
    ...defaultOptions,
    ...parseOptions(options)
  };

  const context = options.context || getContext();
  const notify = context.selectComponent(options.selector);

  if (notify) {
    notify.hide();
  }
};

Notify.setDefaultOptions = (options) => {
  Object.assign(currentOptions, options);
};

Notify.resetDefaultOptions = () => {
  currentOptions = {
    ...defaultOptions
  };
};
