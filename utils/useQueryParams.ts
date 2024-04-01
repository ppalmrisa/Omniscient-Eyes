'use client';

import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { useCallback, useEffect, useState } from 'react';

interface DefaultQueryParams {
  page: number;
  size: number;
  total: number;
  lastPage: number;
  search?: string;
  searchBy?: string;
  [key: string]: any;
}

type QueryParams = DefaultQueryParams;

export const useQueryParams = <T extends QueryParams>() => {
  const pathname = usePathname() as string;
  const searchParams = useSearchParams() as ReadonlyURLSearchParams;
  const router = useRouter();

  const [queryParams, setParams] = useState<DefaultQueryParams>({
    page: 1,
    size: 10,
    total: 0,
    lastPage: 0,
  });

  const updateParams = (params: Partial<T>) => {
    setParams({ ...queryParams, ...params });
  };

  const getQueryParams = useCallback(() => {
    if (!searchParams) {
      return {};
    }
    const params = qs.parse(searchParams.toString(), {
      ignoreQueryPrefix: true,
    }) as {
      [key: string]: any;
    };
    if (params.page && typeof params.page === 'string') params.page = Number(params.page);
    return params;
  }, [searchParams, pathname]);

  useEffect(() => {
    const params = getQueryParams();
    if (!params) return;
    setParams({ ...queryParams, ...params });
  }, [searchParams, pathname]);

  const setQueryParams = (params: Partial<T>) => {
    const oldParams = getQueryParams();
    const newParams = qs.stringify({ ...oldParams, ...params });
    router.replace(`${pathname}?${newParams}`);
  };

  const updateQueryParams = (params: Partial<T>) => {
    const currentParams = qs.parse(searchParams.toString());
    const newSearchParams = { ...currentParams, ...params };
    const newPathname = `${pathname}?${qs.stringify(newSearchParams)}`;
    router.replace(newPathname);
  };

  const deleteQueryParam = (key: string) => {
    const currentParams = qs.parse(searchParams.toString());
    const newSearchParams = { ...currentParams, [key]: undefined };
    const newPathname = `${pathname}?${qs.stringify(newSearchParams)}`;
    router.replace(newPathname);
  };

  const resetQueryParams = () => {
    router.replace(pathname);
  };

  return {
    queryParams,
    router,
    pathname,
    getQueryParams,
    setQueryParams,
    updateQueryParams,
    deleteQueryParam,
    resetQueryParams,
    setParams,
    updateParams,
  };
};
