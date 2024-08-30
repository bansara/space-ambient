declare module "cordova-plugin-background-mode/www/background-mode" {
  const BackgroundMode: {
    enable: () => void;
    disable: () => void;
    isEnabled: () => boolean;
    isActive: () => boolean;
    setDefaults: (options: any) => void;
    configure: (options: any) => void;
    on: (event: string, callback: () => void) => void;
  };

  export default BackgroundMode;
}
