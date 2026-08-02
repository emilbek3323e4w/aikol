"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { Input } from "@/shared/ui/Input";
import { Spinner } from "@/shared/ui/Spinner";
import { useToast } from "@/shared/ui/Toast";
import { MenuItemFormModal } from "@/features/add-menu-item";
import type { MenuCategory, MenuItem } from "@/entities/menu-item/model/types";

export function MenuManagementPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameKg, setCategoryNameKg] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/menu?all=true");
    const json = await res.json();
    if (json.success) {
      setCategories(json.data);
      if (!activeCategoryId && json.data.length > 0) {
        setActiveCategoryId(json.data[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategory(true);
    const res = await fetch("/api/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName, nameKg: categoryNameKg }),
    });
    setSavingCategory(false);
    if (res.ok) {
      showToast("Категория добавлена", "success");
      setCategoryModalOpen(false);
      setCategoryName("");
      setCategoryNameKg("");
      loadCategories();
    } else {
      showToast("Не удалось создать категорию", "error");
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        items: c.items.map((i) =>
          i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i,
        ),
      })),
    );
    const res = await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    if (!res.ok) {
      showToast("Не удалось изменить доступность", "error");
      loadCategories();
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Удалить «${item.name}»?`)) return;
    const res = await fetch(`/api/menu/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Блюдо удалено", "success");
      loadCategories();
    } else {
      showToast("Не удалось удалить блюдо", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-gold">Меню</h1>
        <Button onClick={() => setCategoryModalOpen(true)} variant="secondary">
          + Категория
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-text-muted">Добавьте первую категорию меню</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategoryId(c.id)}
                className={`min-h-11 rounded-lg px-4 py-2 text-sm ${
                  activeCategoryId === c.id
                    ? "bg-gold text-on-gold font-medium"
                    : "bg-bg-secondary text-text-muted"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <Button
            className="mb-6"
            onClick={() => {
              setEditItem(null);
              setItemModalOpen(true);
            }}
          >
            + Добавить блюдо
          </Button>

          <div className="flex flex-col gap-3">
            {activeCategory?.items.length === 0 && (
              <p className="text-text-muted">В этой категории пока нет блюд</p>
            )}
            {activeCategory?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg bg-bg-secondary p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  {item.image && (
                    <Image src={item.image} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-text">{item.name}</p>
                </div>
                <label className="flex items-center gap-2 text-xs text-text-muted">
                  <input
                    type="checkbox"
                    checked={item.isAvailable}
                    onChange={() => handleToggleAvailable(item)}
                    className="h-4 w-4 accent-gold"
                  />
                  Доступно
                </label>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditItem(item);
                    setItemModalOpen(true);
                  }}
                >
                  Изменить
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(item)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Новая категория"
      >
        <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
          <Input
            label="Название (RU)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <Input
            label="Название (KG)"
            value={categoryNameKg}
            onChange={(e) => setCategoryNameKg(e.target.value)}
            required
          />
          <Button type="submit" disabled={savingCategory}>
            Создать
          </Button>
        </form>
      </Modal>

      {itemModalOpen && (
        <MenuItemFormModal
          open={itemModalOpen}
          onClose={() => setItemModalOpen(false)}
          categories={categories}
          defaultCategoryId={activeCategoryId}
          editItem={editItem}
          onSaved={loadCategories}
        />
      )}
    </div>
  );
}
