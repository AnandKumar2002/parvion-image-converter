import { useState, useEffect } from "react";
import { FeatureService } from "../services/feature.service";
import { Category } from "../types/category";
import { Feature } from "../types/feature";

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FeatureService.getCategories().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { categories: data, loading };
}

export function useCategory(slug: string) {
  const [data, setData] = useState<Category | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FeatureService.getCategory(slug).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [slug]);

  return { category: data, loading };
}

export function useFeatures() {
  const [data, setData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FeatureService.getFeatures().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { features: data, loading };
}

export function useFeature(slug: string) {
  const [data, setData] = useState<Feature | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FeatureService.getFeatureBySlug(slug).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [slug]);

  return { feature: data, loading };
}

export function useHighlightedFeatures() {
  const [data, setData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FeatureService.getHighlighted().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { features: data, loading };
}
