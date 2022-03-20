import { useState, useEffect } from 'react';
import type { InfoType } from '../types/components/infolist';
import type { OptionalProps } from '../types/props/optionalProps';
import * as infoListAPI from '../api/getInforList';

const useInfoListState = ({ method, material, status }: OptionalProps) => {
  const [infoList, setInfoList] = useState<InfoType[]>([]);
  const [sortedInfoList, setSortedInfoList] = useState<InfoType[]>([]);

  useEffect(() => {
    const getData = async () => {
      const result: InfoType[] = await infoListAPI.getInfoList();
      setInfoList(result);
      setSortedInfoList(result);
    };
    getData();
  }, []);

  const includeMethod = (listMethod: string[]) => {
    if (method.filter((x) => listMethod.includes(x)).length > 0) {
      return true;
    }
    return false;
  };

  const includeMaterial = (listMaterial: string[]) => {
    if (material.filter((x) => listMaterial.includes(x)).length > 0) {
      return true;
    }
    return false;
  };

  const checkMethodInfoList = () => {
    if (method.length > 0) {
      if (status && material.length > 0) {
        setSortedInfoList(
          infoList.filter(
            (list) => list.status === '상담중' && includeMethod(list.method) && includeMaterial(list.material),
          ),
        );
      } else if (status) {
        setSortedInfoList(infoList.filter((list) => list.status === '상담중' && includeMethod(list.method)));
      } else if (material.length > 0) {
        setSortedInfoList(infoList.filter((list) => includeMaterial(list.material) && includeMethod(list.method)));
      } else {
        setSortedInfoList(infoList.filter((list) => includeMethod(list.method)));
      }
    } else if (status && material.length > 0) {
      checkMaterialInfoList();
    } else if (status) {
      checkStatusInfoList();
    } else if (material.length > 0) {
      checkMaterialInfoList();
    } else {
      setSortedInfoList(infoList);
    }
  };

  const checkMaterialInfoList = () => {
    if (material.length > 0) {
      if (status && method.length > 0) {
        setSortedInfoList(
          infoList.filter(
            (list) => list.status === '상담중' && includeMaterial(list.material) && includeMethod(list.method),
          ),
        );
      } else if (status) {
        setSortedInfoList(infoList.filter((list) => list.status === '상담중' && includeMaterial(list.material)));
      } else if (method.length > 0) {
        setSortedInfoList(infoList.filter((list) => includeMethod(list.method) && includeMaterial(list.material)));
      } else {
        setSortedInfoList(infoList.filter((list) => includeMaterial(list.material)));
      }
    } else if (status && method.length > 0) {
      checkMethodInfoList();
    } else if (status) {
      checkStatusInfoList();
    } else if (method.length > 0) {
      checkMethodInfoList();
    } else {
      setSortedInfoList(infoList);
    }
  };

  const checkStatusInfoList = () => {
    if (status) {
      if (method.length > 0 || material.length > 0) {
        setSortedInfoList(sortedInfoList.filter((list) => list.status === '상담중'));
      } else {
        setSortedInfoList(infoList.filter((list) => list.status === '상담중'));
      }
    } else if (method.length > 0 || material.length > 0) {
      checkMethodInfoList();
      checkMaterialInfoList();
    } else {
      setSortedInfoList(infoList);
    }
  };

  useEffect(() => {
    checkMethodInfoList();
  }, [method]);

  useEffect(() => {
    checkMaterialInfoList();
  }, [material]);

  useEffect(() => {
    checkStatusInfoList();
  }, [status]);

  return { sortedInfoList };
};

export default useInfoListState;
