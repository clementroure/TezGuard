import smartpy as sp
FA2 = sp.io.import_script_from_url("https://smartpy.io/templates/fa2_lib.py")
testing = sp.io.import_script_from_url("https://smartpy.io/templates/fa2_lib_testing.py")

class NFT(FA2.Fa2Nft, FA2.Admin, FA2.MintNft, FA2.BurnNft):
    def __init__(self, admin, metadata):
        FA2.Fa2Nft.__init__(self, metadata, policy = FA2.NoTransfer())
        FA2.Admin.__init__(self, admin)

@sp.add_test(name="tests")
def test():

    admin = sp.address("tz1gYdwegPS6XEdEv6g3ESwfUUyu7e4QBqv8")
    bob = sp.address("tz1Z6uQCVb3wzHuQgJgdnTBmPbugzGZJJkXn")
    
    scenario = sp.test_scenario()
    
    nft = NFT(admin=admin, metadata= sp.big_map({"content": sp.utils.bytes_of_string("""{"name": "TezGuard", "description": "NFT used as permisisons"}""")}))
    scenario += nft

    # Test contract
    # We are using the mint method
    # + we use the policy to disable transfers

    admin = sp.test_account("Administrator")
    alice = sp.test_account("Alice")
    tok0_md = FA2.make_metadata(name="Token Zero", decimals=1, symbol="Tok0")
    tok1_md = FA2.make_metadata(name="Token One", decimals=1, symbol="Tok1")
    tok2_md = FA2.make_metadata(name="Token Two", decimals=1, symbol="Tok2")
    TOKEN_METADATA = [tok0_md, tok1_md, tok2_md]
    METADATA = sp.utils.metadata_of_url("ipfs://example")

    def _pre_minter(base_class=FA2.Fa2Nft, policy=None):
        token_metadata = TOKEN_METADATA
        ledger = {0: alice.address, 1: alice.address, 2: alice.address}
        return base_class(
            metadata=METADATA,
            token_metadata=token_metadata,
            ledger=ledger,
            policy=policy,
        )

    # Methods we used. We call some of them from the frontend.
    for _Fa2 in [FA2.Fa2Nft]:
        testing.test_core_interfaces(_pre_minter(_Fa2))
        testing.test_transfer(_pre_minter(_Fa2))
        # testing.test_balance_of(_pre_minter(_Fa2))
        testing.test_no_transfer(_pre_minter(_Fa2, policy=FA2.NoTransfer()))
        testing.test_owner_transfer(_pre_minter(_Fa2, policy=FA2.OwnerTransfer()))
        testing.test_owner_or_operator_transfer(_pre_minter(_Fa2))