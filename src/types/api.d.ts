/**
 * 文件API类型声明
 */
export interface FileInfo {
  name: string;
  url: string;
}

export interface BalanceType {
  balance?: string;
  freezeBalance?: string;
}

export interface TopMenuType {
  index: number;
  title: string;
  type: string;
  id: any;
  route: string;
  routeName: string;
  isHot: boolean;
  children: any[];
  gamerList: any[];
  gamerIndex: number;
}
