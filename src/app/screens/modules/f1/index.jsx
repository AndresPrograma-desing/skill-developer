import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell, Text, TableA, CardV1, Loading, Selector } from 'anteriority-ui';
import { SiF1 as SiF1 } from 'anteriority-ui/screens/components/Icons/si';
import { Trophy, Flag, Timer, RefreshCw, LogOut } from 'lucide-react';

import { SEMANTIC_COLORS, LIGHT_THEME } from '../../../ui';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  fetchDriverStandings,
  fetchLastRaceResults,
  selectDriverStandings,
  selectLastRace,
  selectFavoriteDriverId,
  setFavoriteDriver,
} from '../../../../redux/slices/f1Slice';

import { F1_LOADING_MIN_VISIBLE_MS, getF1StandingsColumns } from './constants';
import { mapStandingsToRows, getRaceWinner, getFastestLap } from './utils';
import styles from './styles.module.scss';

// Módulo de ejemplo: consume la API histórica de F1 (Jolpica/Ergast) vía Redux + services.
// Ver AnteriorityUI.md en la raíz del proyecto para más props de AppShell, TableA y CardV1.
export const F1 = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const standings = useAppSelector(selectDriverStandings);
  const standingsLoading = useAppSelector(state => state.f1.standingsLoading);
  const standingsError = useAppSelector(state => state.f1.standingsError);

  const lastRace = useAppSelector(selectLastRace);
  const lastRaceLoading = useAppSelector(state => state.f1.lastRaceLoading);
  const lastRaceError = useAppSelector(state => state.f1.lastRaceError);

  const favoriteDriverId = useAppSelector(selectFavoriteDriverId);
  const [activeView, setActiveView] = useState('standings');

  const isFetching = standingsLoading || lastRaceLoading;
  const [showLoading, setShowLoading] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);
  const loadingStartedAtRef = useRef(null);

  const fetchData = () => {
    dispatch(fetchDriverStandings());
    dispatch(fetchLastRaceResults());
  };

  const loadData = () => {
    loadingStartedAtRef.current = Date.now();
    setShowLoading(true);
    setLoadingActive(true);
    fetchData();
  };

  useEffect(() => {
    loadingStartedAtRef.current = Date.now();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetching || !showLoading) return undefined;

    const elapsed = Date.now() - (loadingStartedAtRef.current ?? Date.now());
    const remaining = Math.max(F1_LOADING_MIN_VISIBLE_MS - elapsed, 0);

    const timer = setTimeout(() => setLoadingActive(false), remaining);
    return () => clearTimeout(timer);
  }, [isFetching, showLoading]);

  const rows = mapStandingsToRows(standings);
  const favoriteRow = rows.find(row => row.id === favoriteDriverId) ?? null;
  const columns = getF1StandingsColumns(t);
  const emptyValue = t('f1.empty');

  return (
    <AppShell
      sidebarProps={{
        groups: [
          {
            title: t('f1.title'),
            items: [
              { id: 'standings', label: t('f1.sidebar.standings'), icon: SiF1 },
              { id: 'last-race', label: t('f1.sidebar.lastRace'), icon: SiF1 },
            ],
          },
        ],
        activeId: activeView,
        onSelect: item => setActiveView(item.id),
        user: {
          name: 'Max Verstappen',
          email: 'max.verstappen@example.com',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        userMenuItems: [{ id: 'logout', label: t('f1.actions.logout'), icon: LogOut, variant: 'danger' }],
        headerContent: (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <SiF1 size={70} />
          </div>
        ),
      }}
      topBarProps={{
        title: t('f1.title'),
        logo: <SiF1 />,
        breadcrumbItems: [{ label: t('f1.sidebar.standings'), onClick: () => {} }, { label: t('f1.title') }],
        actions: [
          {
            key: 'refresh',
            icon: RefreshCw,
            tooltip: t('f1.actions.refresh'),
            onClick: loadData,
          },
        ],
        user: {
          name: 'Max Verstappen',
          email: 'max.verstappen@example.com',
        },
        showDivider: true,
      }}
      contentBgColor={LIGHT_THEME.bgPrimary}
      useContainer
      containerProps={{ style: { margin: '24px auto' } }}
    >
      {showLoading ? (
        <Loading
          text="F1"
          size="giant"
          variant="text-3d"
          color={SEMANTIC_COLORS.danger}
          active={loadingActive}
          onExited={() => setShowLoading(false)}
        />
      ) : (
        <div className={styles.main}>
          <Text variant="h1">{t('f1.title')}</Text>

          <div className={styles.cardsRow}>
            <CardV1
              badgeIcon={Trophy}
              badgeText={t('f1.cards.lastRace')}
              primaryText={lastRace?.raceName ?? emptyValue}
              secondaryText={getRaceWinner(lastRace) ?? emptyValue}
              footerIcon={Flag}
              footerContent={lastRace?.Circuit?.circuitName}
              isLoading={lastRaceLoading}
              isError={Boolean(lastRaceError)}
              errorText={lastRaceError}
            />
            <CardV1
              badgeIcon={Timer}
              badgeText={t('f1.cards.fastestLap')}
              primaryText={t('f1.cards.lastRace')}
              secondaryText={getFastestLap(lastRace) ?? emptyValue}
              isLoading={lastRaceLoading}
              isError={Boolean(lastRaceError)}
              errorText={lastRaceError}
            />
          </div>

          {activeView === 'last-race' ? (
            <div className={styles.favoritePanel}>
              <Text variant="h3">{t('f1.favorite.title')}</Text>
              <Selector
                label={t('f1.favorite.label')}
                placeholder={t('f1.favorite.placeholder')}
                options={rows.map(row => ({ value: row.id, label: row.driver }))}
                value={favoriteDriverId ?? ''}
                onChange={event => dispatch(setFavoriteDriver(event.target.value || null))}
              />
              {favoriteRow ? (
                <div className={styles.favoriteCard}>
                  <Text variant="h3">{favoriteRow.driver}</Text>
                  <div className={styles.favoriteStats}>
                    <span>{`${t('f1.favorite.position')}: ${favoriteRow.position}`}</span>
                    <span>{`${t('f1.favorite.team')}: ${favoriteRow.team}`}</span>
                    <span>{`${t('f1.favorite.points')}: ${favoriteRow.points}`}</span>
                    <span>{`${t('f1.favorite.wins')}: ${favoriteRow.wins}`}</span>
                  </div>
                </div>
              ) : (
                <Text variant="body">{t('f1.favorite.empty')}</Text>
              )}
            </div>
          ) : (
            <>
              <Text variant="h3">{t('f1.standingsTitle')}</Text>
              <TableA
                columns={columns}
                data={rows}
                keyExtractor={row => row.id}
                loading={standingsLoading}
                error={standingsError}
                onRetry={() => dispatch(fetchDriverStandings())}
              />
            </>
          )}
        </div>
      )}
    </AppShell>
  );
};

export default F1;
