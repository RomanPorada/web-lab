from enum import Enum

class AtomType(Enum):
    ISOTOPE = "Isotope"
    RADIOACTIVE = "Radioactive"
    ION = "Ion"
    ANTIMATTER = "Antimatter"
    STABLE = "Stable"

class Atom:
    def __init__(self, name="Невідомо", atomic_mass_unit=1, neutrons_number=1,
                 protons_number=1, electrons_number=1, chemical_record="X", atom_tupe=AtomType.STABLE):
        self.name = name
        self.atomic_mass_unit = atomic_mass_unit
        self.neutrons_number = neutrons_number
        self.protons_number = protons_number
        self.electrons_number = electrons_number
        self.chemical_record = chemical_record
        self.atom_tupe = atom_tupe
        self.id = None

    def is_neutral(self):
        return self.protons_number == self.electrons_number
