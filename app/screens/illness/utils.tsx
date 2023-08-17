import {
  IllnessSubroupsResponse,
  IllnessSubgroupListResultsResponse,
} from './api/Models';

const fillData = (): Map<string, string> => {
  const imageMap = new Map<string, string>();
  imageMap.set('depression', 'depression');
  imageMap.set('ocd', 'ocd');
  imageMap.set('ptsd', 'ptsd');
  imageMap.set('anxiety', 'anxiety');
  imageMap.set('addiction', 'addiction');
  imageMap.set('work related stress', 'work_health');
  return imageMap;
};

const IMAGE_MAP = fillData();

/**
 * Filters Subgroup data without group name and image
 * @param illnessSubgroups
 * @returns Illness subgroup resaponse with all subgroups having image and text.
 */
export const filterIllnessData = (
  illnessSubgroups: IllnessSubroupsResponse,
): IllnessSubroupsResponse => {
  const {groupTypeList} = illnessSubgroups;
  const filteredSubgroupArray = [] as Array<IllnessSubgroupListResultsResponse>;
  if (groupTypeList && groupTypeList.length > 0) {
    groupTypeList.map((subgroup) => {
      if (!subgroup.subGroupType || !subgroup.subGroupTypeImageUrl) {
        return;
      }
      subgroup.subGroupTypeImageUrl =
        IMAGE_MAP.get(subgroup.subGroupType.toLowerCase()) ||
        subgroup.subGroupTypeImageUrl;
      filteredSubgroupArray.push(subgroup);
    });
  }
  illnessSubgroups.groupTypeList = filteredSubgroupArray;
  return illnessSubgroups;
};
