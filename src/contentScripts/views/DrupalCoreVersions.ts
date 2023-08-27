export type DrupalCoreVersion = {
  name: string;
  value: string;
  min_php: string;
  max_php: string;
};

export const drupal_core_versions: DrupalCoreVersion[] = [
        {
          name: 'Latest 8.9.x',
          value: '8.9.x',
          min_php: '7.3',
          max_php: '7.4',
        },
        {
          name: 'Latest 9.3',
          value: '9.3.12',
          min_php: '7.3',
          max_php: '8.1',
        },
        {
          name: '9.3.x',
          value: '9.3.x',
          min_php: '7.3',
          max_php: '8.1',
        },
        {
          name: '9.4.x',
          value: '9.4.x',
          min_php: '7.3',
          max_php: '8.1',
        },
        {
          name: '10.0.x',
          value: '10.0.x',
          min_php: '8.1',
          max_php: '8.1',
        },
      ];